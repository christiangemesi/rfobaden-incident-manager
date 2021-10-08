package ch.rfobaden.incidentmanager.backend;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties("app")
public final class AppProperties {
    private EnvironmentName environment;

    public EnvironmentName getEnvironment() {
        return environment;
    }

    public void setEnvironment(EnvironmentName environment) {
        this.environment = environment;
    }

    public enum EnvironmentName {
        DEVELOPMENT,
        TESTING,
        PRODUCTION,
    }
}
