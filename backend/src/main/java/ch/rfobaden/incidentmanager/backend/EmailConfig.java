package ch.rfobaden.incidentmanager.backend;

import ch.rfobaden.incidentmanager.backend.errors.MailException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.util.Properties;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Configuration
public class EmailConfig {

    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("lx52.hoststar.hosting");
        mailSender.setPort(465);

        mailSender.setUsername("im@rfo-baden.ch");
        mailSender.setPassword("54Rf0_ImT00l.17");

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.ssl.enable", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true");

        return mailSender;
    }

    public String getPasswordTemplateMessage(String receiver, String plainPassword) {
        StringBuilder msg = new StringBuilder();
        msg.append("<h1>Incident Manager RFOBaden</h1>");
        msg.append("<p>Ein Benutzer wurde für Sie im Incident Manager erstellt.</p><br>");
        msg.append("<table>");
        msg.append("<tr>\n"
            + "     <th style=\"display:block;margin-right: 50px;text-align: left;\">E-Mail</th>\n"
            + "     <td>" + receiver + "</td>\n"
            + "   </tr>");
        msg.append("<tr>\n"
            + "     <th style=\"display:block;margin-right: 50px;text-align: left;\">"
            + "Password</th>\n"
            + "     <td>" + plainPassword + "</td>\n"
            + "   </tr>");
        msg.append("</table><br>");
        msg.append(
            "<p>Sie können sich unter <a href=\\\"https://im.rfobaden.ch\\\">"
                + "https://im.rfobaden.ch</a> und dann das Passwort ändern.</p>");
        msg.append(
            "<b style=\"color:red;\">Dies ist eine automatisch generierte mail. "
                + "Bitte antworten sie nicht auf diese E-Mail.</b>");
        return msg.toString();
    }

    public String getAssignmentTemplateMessage(String info, String link) {
        StringBuilder msg = new StringBuilder();
        msg.append("<h1>Incident Manager RFOBaden</h1>");
        msg.append(
            "<p>Ihnen wurde etwas zugewiesen.</p><br>");
        msg.append("<table>");
        msg.append("<tr>\n"
            + "     <th style=\"display:block;margin-right: 50px;text-align: left;\">Title</th>\n"
            + "     <td>" + info + "</td>\n"
            + "   </tr>");
        msg.append("<tr>\n"
            + "     <th style=\"display:block;margin-right: 50px;text-align: left;\">Link</th>\n"
            + "     <td><a href=\"https://im.rfobaden.ch/" + link + "\">https://im.rfobaden.ch/"
            + link + "</a></td>\n"
            + "   </tr>");
        msg.append("</table><br>");
        msg.append(
            "<b style=\"color:red;\">Dies ist eine automatisch generierte mail. "
                + "Bitte antworten sie nicht auf diese E-Mail.</b>");
        return msg.toString();
    }

    public void sendSimpleMessage(String receiver, String subject, String text) {
        try {
            MimeMessage mimeMessage = getJavaMailSender().createMimeMessage();
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, "utf-8");
            message.setFrom("im@rfo-baden.ch");
            message.setTo(receiver);
            message.setSubject(subject);
            message.setText(text, true);
            getJavaMailSender().send(mimeMessage);
        } catch (MessagingException e) {
            throw new MailException(e.getMessage());
        }
    }
}
