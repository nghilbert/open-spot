import { TimerType, User, Location } from "@prisma/client";
import { prismaClient } from "src/prismaClient";

export class TimerController {
    private activeTimers: {[key: number]: NodeJS.Timeout} = {};

    private async endTimer(timerID: number){
        try {
            await prismaClient.timer.delete({ where: {
                id: timerID
            }});

            clearTimeout(this.activeTimers[timerID]);
            delete this.activeTimers[timerID];

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

    public async startTimer(user: User, location: Location, seconds: number){
        // Insert a new timer for the user and location, then start the timeout
        try {
            const startTime = new Date();
            const endTime = new Date(startTime.getTime() + seconds * 1000);
            const timeLeft = endTime.getTime() - startTime.getTime();
    
            const timer = await prismaClient.timer.create({
                data: {
                    startTime,
                    endTime,
                    status: TimerType.ACTIVE,
                    user: { connect: user },
                    location: { connect: location }
                }
            });
    
            const timeout = setTimeout(async () => {
                // This function here sends the notification after the time is over
                await this.endTimer(timer.id);
                await this.sendNotification(timer.userId);
            }, timeLeft);

            this.activeTimers[timer.id] = timeout;

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