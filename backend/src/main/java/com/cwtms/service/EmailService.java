package com.cwtms.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Async
    public void sendNotificationEmail(String toEmail, String subject, String body) {
        if (toEmail == null || toEmail.trim().isEmpty()) {
            log.warn("Cannot send email: recipient email is null or empty");
            return;
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            printConsolePreview(toEmail, subject, body);
            return;
        }

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(toEmail);
            mailMessage.setSubject(subject);
            mailMessage.setText(body);
            mailMessage.setFrom("no-reply@cwtms.com");

            mailSender.send(mailMessage);
            log.info("Email successfully sent to {}", toEmail);
        } catch (Exception e) {
            log.warn("Live SMTP email delivery failed for {} (Error: {}). Printing console preview instead.", toEmail, e.getMessage());
            printConsolePreview(toEmail, subject, body);
        }
    }

    private void printConsolePreview(String toEmail, String subject, String body) {
        System.out.println("\n" +
                "========================================================================\n" +
                "[EMAIL SYSTEM - LOCAL PREVIEW (SMTP Connection Failed / Not Configured)]\n" +
                "Recipient: " + toEmail + "\n" +
                "Subject:   " + subject + "\n" +
                "Message:   " + body + "\n" +
                "------------------------------------------------------------------------\n" +
                "To enable real delivery, configure SMTP credentials in application.properties\n" +
                "========================================================================\n");
    }
}
