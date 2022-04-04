package ch.rfobaden.incidentmanager.backend;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@ConstructorBinding
@ConfigurationProperties("rfo")
public class RfoConfig {
    private final String stage;

    private final Frontend frontend;

    private final Jwt jwt;

    private final Email email;

    public RfoConfig(String stage, Frontend frontend, Jwt jwt, Email email) {
        this.stage = stage;
        this.frontend = frontend;
        this.jwt = jwt;
        this.email = email;
    }

    public String getStage() {
        return stage;
    }

    public Frontend getFrontend() {
        return frontend;
    }

    public Jwt getJwt() {
        return jwt;
    }

    public Email getEmail() {
        return email;
    }

    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(email.host);
        mailSender.setPort(email.port);

        mailSender.setUsername(email.username);
        mailSender.setPassword(email.password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.ssl.enable", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true");

        return mailSender;
    }

    public static class Frontend {
        private final String host;

        public Frontend(String host) {
            this.host = host;
        }

        public String getHost() {
            return host;
        }
    }

    public static class Jwt {
        private final String secret;

        public Jwt(String secret) {
            this.secret = secret;
        }

        public String getSecret() {
            return secret;
        }
    }

    public static class Email {
        private final String host;
        private final int port;
        private final String username;
        private final String password;

        public Email(String host, int port, String username, String password) {
            this.host = host;
            this.port = port;
            this.username = username;
            this.password = password;
        }
    }
}