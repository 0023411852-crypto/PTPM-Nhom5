using System;
using System.Threading.Tasks;
using CloudService.Application.Interfaces;

namespace CloudService.Application.Services
{
    public class ConsoleEmailService : IEmailService
    {
        public Task SendEmailAsync(string toEmail, string subject, string body)
        {
            // Simulate sending email by printing to Console
            Console.WriteLine("=============================================");
            Console.WriteLine($"[EMAIL SENT to {toEmail}]");
            Console.WriteLine($"[SUBJECT] {subject}");
            Console.WriteLine($"[BODY]\n{body}");
            Console.WriteLine("=============================================");
            
            return Task.CompletedTask;
        }
    }
}
