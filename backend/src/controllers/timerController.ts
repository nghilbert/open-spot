import { TimerType, User } from "@prisma/client";
import { Location } from "@openspot/shared";
import { prismaClient } from "../prismaClient";

export class TimerController {
    private activeTimers: {[key: number]: NodeJS.Timeout} = {};

    private async endTimer(timerID: number){
        try {
            await prismaClient.timer.delete({ where: {
                id: timerID
            }});

            if(timerID in this.activeTimers){
                clearTimeout(this.activeTimers[timerID]);
                delete this.activeTimers[timerID];
            }

            return true;
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
            // Skip timeout if there is no end time, i.e. count up only
            if(!timer.endTime)
                continue;

            // Gets the time in milliseconds between the end and current time
            const now = new Date();
            let timeLeft = timer.endTime.getTime() - now.getTime();

            if(timeLeft <= 0){
                timeLeft = 1;
            }

            const timeout = setTimeout(async () => {
                // This function here sends the notification after the time is over
                await this.endTimer(timer.id);
                await this.sendNotification(timer.userId);
            }, timeLeft);

            this.activeTimers[timer.id] = timeout;
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
                    location: { connect: { id: location.id } }
                }
            });
    
            if(endTime){
                // Construct timeout if a set duration is provided
                const timeLeft = endTime.getTime() - startTime.getTime();

                const timeout = setTimeout(async () => {
                    // This function here sends the notification after the time is over
                    await this.endTimer(timer.id);
                    await this.sendNotification(timer.userId);
                }, timeLeft);
    
                this.activeTimers[timer.id] = timeout;
            }

            return true;
        } catch(err){
            console.error(err);
        }

        return false;
    }

    public async clearTimer(userID: number){
        try {
            const timerData = await prismaClient.timer.findUnique({
                where: { userId: userID }
            });
            
            if(timerData){
                this.endTimer(timerData.id);
                return true;
            } else {
                return false;
            }
        } catch(err){
            console.error(err);
        }

        return false;
    }

    public async sendNotification(userID: number){
        console.log(`TODO: Implement notification service. Anyway, 'sent' notification to ${userID}`)
    }
};