import { Timer, TimerType, User } from "@prisma/client";
import { Location } from "@prisma/client";
import { prismaClient } from "../prismaClient";
import { emailController } from ".";

const hostname = process.env.HOSTNAME || "http://localhost:3000";

export class TimerController {
    private activeTimers: {[key: number]: NodeJS.Timeout} = {}; // Key is timerID
    private pendingConfirmations: {[key: number]: NodeJS.Timeout} = {}; // Key is timerID
    private pendingExpirations: {[key: number]: NodeJS.Timeout} = {}; // Key is timerID
    private unlimitedInterval: number = 60 * 60 * 8; // in seconds
    private confirmationTimeout: number = 60 * 60; // in seconds
    private expirationTimeout: number = 60 * 60 * 24; // in seconds

    private async createTimer(timer: Timer){
        // Creates the timeout or interval
        if(timer.endTime){
            // Create the timeout
            const now = new Date();
            let timeLeft = timer.endTime.getTime() - now.getTime();
    
            if(timeLeft <= -1000000){
                // Ignore insanely long expired timers, it's not worth the flood of notifs that far long ago
                return;
            } else if(timeLeft <= 0){
                timeLeft = 1;
            }
    
            const timeout = setTimeout(async () => {
                // This function here sends the notification after the time is over
                await this.sendExpiredNotification(timer.userId);
            }, timeLeft);

            this.activeTimers[timer.id] = timeout;
        } else {
            // Create the reminder intnerval
            const interval = setInterval(async () => {
                // Send confirmation
                await this.sendConfirmationNotification(timer.userId);
            }, this.unlimitedInterval * 1000);

            this.activeTimers[timer.id] = interval;
        }
    }

    private async clearTimer(timerID: number){
        try {
            const timer = await prismaClient.timer.delete({ where: {
                id: timerID
            }});

            if(timerID in this.activeTimers){
                if(timer.endTime){
                    clearTimeout(this.activeTimers[timerID]);
                } else {
                    clearInterval(this.activeTimers[timerID]);

                    if(timerID in this.pendingConfirmations){
                        clearTimeout(this.pendingConfirmations[timerID]);
                    }
                }

                delete this.activeTimers[timerID];
            }

            // Remove expiration timeout
            if(timer.id in this.pendingExpirations){
                clearTimeout(this.pendingExpirations[timer.id]);
                delete this.pendingExpirations[timer.id];
            }

            return true;
        } catch(err){
            console.error(err);
        }

        return false;
    }

    private async sendExpiredNotification(userID: number){
        // Start a timeout for the user needing to acknowledge/end, otherwise prune
        try {
            const timerData = await prismaClient.timer.update({
                where: {
                    userId: userID
                },
                data: {
                    status: "EXPIRED"
                },
                include: {
                    user: true
                }
            });
            
            const timeout = setTimeout(async () => {
                // Clear out the expiration, its been a long time. use clearTimer to avoid updating average
                await this.clearTimer(timerData.id);
            }, this.expirationTimeout * 1000);
    
            this.pendingExpirations[timerData.id] = timeout;
    
            console.log(`User ${userID} has expired their timer`);
            await emailController.sendEmail(timerData.user.email, "Parking lot expired!", `Your parking lot reservation has expired! Please <a href="${hostname}/timer/confirm_expire">click here</a> to acknowledge. `);
            return true;
        } catch(err){
            console.error(err);
        }

        return false;
    }

    private async sendConfirmationNotification(userID: number){
        try {
            const timerData = await prismaClient.timer.findUnique({
                where: {
                    userId: userID
                },
                include: {
                    user: true
                }
            });

            // Check for confirmation
            if(timerData){
                const timeout = setTimeout(async () => {
                    // If this timeout completes, the user was never confirmed, so expire the timer.
                    await this.sendExpiredNotification(timerData.userId);
                }, this.confirmationTimeout * 1000);
    
                this.pendingConfirmations[timerData.id] = timeout;
    
                console.log(`User ${userID} needs to confirm their timer`);
                await emailController.sendEmail(timerData.user.email, "Parking lot reconfirmation", `Your parking lot reservation has been in use for a while! Please <a href="${hostname}/timer/still_there">click here</a> to confirm you are still using it. `);
                return true;
            }
        } catch(err){
            console.error(err);
        }

        return false;
    }

    public async initTimersFromDB(){
        // This constructs all timeouts from the database, this should be called once on startup
        const timers = await prismaClient.timer.findMany({
            where: {
                status: TimerType.ACTIVE
            },
            include: {
                user: true
            }
        });

        for(let timer of timers){
            await this.createTimer(timer);
        }

        // Reconstruct all pruning
        const expiredTimers = await prismaClient.timer.findMany({
            where: {
                status: TimerType.EXPIRED
            }
        });

        for(let timer of expiredTimers){
            const timeout = setTimeout(async () => {
                // Clear out the expiration, its been a long time. use clearTimer to avoid updating average
                await this.clearTimer(timer.id);
            }, this.expirationTimeout * 1000);
    
            this.pendingExpirations[timer.id] = timeout;
        }
    }

    public async startTimer(user: User, location: Location, seconds?: number){
        // Insert a new timer for the user and location, then start the timeout
        try {
            const startTime = new Date();
            const endTime = seconds ? new Date(startTime.getTime() + seconds * 1000) : undefined;
    
            const timer = await prismaClient.timer.create({
                data: {
                    startTime,
                    endTime,
                    status: TimerType.ACTIVE,
                    user: { connect: user },
                    location: { connect: location }
                }
            });
    
            await this.createTimer(timer);
            return true;
        } catch(err){
            console.error(err);
        }

        return false;
    }

    public async reconfirmTimer(userID: number){
        // This is used to confirm an unlimited time parking spot is still being used
        try {
            const timerData = await prismaClient.timer.findUnique({
                where: {
                    userId: userID,
                    status: "ACTIVE"
                }
            });
            
            if(timerData && timerData.id in this.pendingConfirmations){
                clearTimeout(this.pendingConfirmations[timerData.id]);
                delete this.pendingConfirmations[timerData.id];
                return true;
            }
        } catch(err){
            console.error(err);
        }

        return false;
    }

    public async endTimer(userID: number){
        // Once the user acknowledges the timer is expired or ending early, it can be removed and total time recorded into historical times
        try {
            const timerData = await prismaClient.timer.findUnique({
                where: {
                    userId: userID
                }
            });
            
            if(timerData){
                // A timer exists, move it
                await prismaClient.historicalTimes.create({
                    data: {
                        startTime: timerData.startTime,
                        endTime: timerData.endTime || new Date(),
                        locationId: timerData.locationId
                    }
                });

                // Remove it from active timers
                await this.clearTimer(timerData.id);

                // Recompute historical average
                let average = 0;

                const data = await prismaClient.historicalTimes.findMany({
                    where: {
                        locationId: timerData.locationId
                    }
                });

                const now = new Date();

                for(let timer of data){
                    average += (now.getTime() - timer.startTime.getTime()) / 1000;
                }
                
                average /= data.length;

                await prismaClient.location.update({
                    where: {
                        id: timerData.locationId
                    },
                    data: {
                        averageParkingTime: average
                    }
                });

                return true;
            }
        } catch(err){
            console.error(err);
        }

        return false;
    }

    public async getTimerStatus(userID: number){
        // Returns the status of the timer
        try {
            const timer = await prismaClient.timer.findUnique({
                where: {
                    userId: userID
                }
            });

            if(timer){
                return {
                    status: timer.status,
                    startTime: timer.startTime,
                    endTime: timer.endTime,
                    locationID: timer.locationId,
                };
            }
        } catch(err){
            console.error(err);
        }

        return false;
    }
};