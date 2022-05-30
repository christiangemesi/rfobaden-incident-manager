package ch.rfobaden.incidentmanager.backend.services.notifications;

import ch.rfobaden.incidentmanager.backend.RfoConfig;
import ch.rfobaden.incidentmanager.backend.errors.MailException;
import ch.rfobaden.incidentmanager.backend.models.Trackable;
import ch.rfobaden.incidentmanager.backend.models.User;
import org.springframework.context.annotation.Primary;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
@Primary
public class EmailNotificationService implements NotificationService {
    private final RfoConfig rfoConfig;

    private final JavaMailSender sender;

    private static final String MAILTITLE = "<h1>Incident Manager RFOBaden</h1>";

    public EmailNotificationService(RfoConfig rfoConfig, JavaMailSender sender) {
        this.rfoConfig = rfoConfig;
        this.sender = sender;
    }

    @Override
    public void notifyNewUser(User user, String plainPassword) {
        String text = buildNewUserMessage(user, plainPassword);
        send(user.getEmail(), "[RFOBaden IncidentManager] Benutzer erstellt", text);
    }

    private String buildNewUserMessage(User user, String plainPassword) {
        StringBuilder msg = new StringBuilder();
        msg.append(MAILTITLE);
        msg.append("<p>Ein Benutzer wurde für Sie im Incident Manager erstellt.</p><br>");
        return emailAndPasswordBody(user, plainPassword, msg);
    }

    @Override
    public void notifyAssignee(Trackable entity, User assignee) {
        String text = buildAssigneeMessage(entity);
        send(
            assignee.getEmail(),
            "[RFOBaden IncidentManager] Zuweisung '" + entity.getFullTitle() + "'",
            text
        );
    }

    private String buildAssigneeMessage(Trackable entity) {
        StringBuilder msg = new StringBuilder();
        msg.append(MAILTITLE);
        msg.append("<p>");
        msg.append("  Ihnen wurde etwas zugewiesen.");
        msg.append("</p>");
        msg.append("<br>");
        msg.append("<table>");
        msg.append("  <tr>");
        msg.append("    <th style=\"display:block; margin-right: 50px; text-align: left;\">");
        msg.append("      Titel");
        msg.append("    </th>");
        msg.append("    <td>");
        msg.append(entity.getFullTitle());
        msg.append("    </td>");
        msg.append("  <tr>");
        msg.append("  <tr>");
        msg.append("    <th style=\"display:block; margin-right: 50px; text-align: left;\">");
        msg.append("      Link");
        msg.append("    </th>");
        msg.append("    <td>");
        msg.append(rfoConfig.getFrontend().getHost()).append(entity.getLink());
        msg.append("    </td>");
        msg.append("  <tr>");
        msg.append("</table>");
        msg.append(buildDoNotAnswerMessage());
        return msg.toString();
    }

    public void notifyPasswordReset(User user, String plainPassword) {
        var text = buildPasswordResetMessage(user, plainPassword);
        send(user.getEmail(), "[RFOBaden IncidentManager] Passwort zurückgesetzt", text);
    }

    private String buildPasswordResetMessage(User user, String plainPassword) {
        var msg = new StringBuilder();
        msg.append(MAILTITLE);
        msg.append("<p>Ihr Passwort wurde zurückgesetzt.</p><br>");
        return emailAndPasswordBody(user, plainPassword, msg);
    }

    private String emailAndPasswordBody(User user, String plainPassword, StringBuilder msg) {
        msg.append("<table>");
        msg.append("  <tr>");
        msg.append("    <th style=\"display:block; margin-right: 50px; text-align: left;\">");
        msg.append("      E-Mail");
        msg.append("    </th>");
        msg.append("    <td>");
        msg.append(user.getEmail());
        msg.append("    </td>");
        msg.append("  <tr>");
        msg.append("  <tr>");
        msg.append("    <th style=\"display:block; margin-right: 50px; text-align: left;\">");
        msg.append("      Passwort");
        msg.append("    </th>");
        msg.append("    <td>");
        msg.append(plainPassword);
        msg.append("    </td>");
        msg.append("  <tr>");
        msg.append("</table>");
        msg.append("<br>");
        msg.append(buildLoginMessage());
        msg.append(buildDoNotAnswerMessage());
        return msg.toString();
    }

    private String buildLoginMessage() {
        String frontendHost = rfoConfig.getFrontend().getHost();
        StringBuilder msg = new StringBuilder();
        msg.append("<p>");
        msg.append("  Sie können sich unter");
        msg.append("  <a href=\"").append(frontendHost).append("\">").append(frontendHost).append("</a>");
        msg.append("  anmelden");
        msg.append("</p>");
        return msg.toString();
    }

    private String buildDoNotAnswerMessage() {
        StringBuilder msg = new StringBuilder();
        msg.append("<b style=\"color:red;\">");
        msg.append("  Dies ist eine automatisch generierte Nachricht.");
        msg.append("  Bitte antworten sie nicht auf diese E-Mail.");
        msg.append("</b>");
        return msg.toString();
    }

    private void send(String to, String subject, String text) {
        try {
            MimeMessage mimeMessage = sender.createMimeMessage();
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, "utf-8");
            message.setFrom("im@rfo-baden.ch");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text, true);
            sender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new MailException(e.getMessage());
        }
    }
}
