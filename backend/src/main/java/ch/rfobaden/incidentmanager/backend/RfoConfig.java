package ch.rfobaden.incidentmanager.backend;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;

@ConstructorBinding
@ConfigurationProperties("rfo")
public class RfoConfig {
    private final String stage;

    private final Frontend frontend;

    private final Jwt jwt;

    public RfoConfig(String stage, Frontend frontend, Jwt jwt) {
        this.stage = stage;
        this.frontend = frontend;
        this.jwt = jwt;
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
}