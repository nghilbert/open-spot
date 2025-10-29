import { Resend } from "resend";

export class EmailController {
    // Variables
    private emailService;
    
    // Functions
    constructor(){
        // Create mailing system, which for simplicity is gmail
        this.emailService = new Resend(process.env.RESEND_API_KEY);
    }

    private isEmail(address: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(address);
    }

    public async sendEmail(address: string, subject: string, content: string): Promise<boolean> {
        // This is a generic email sending function
        if(!this.isEmail(address)){
            return false;
        }
        
        let response = await this.emailService.emails.send({
            from: "onboarding@resend.dev",
            to: address,
            subject: subject,
            html: content
        });

        return response.error !== null;
    }
}