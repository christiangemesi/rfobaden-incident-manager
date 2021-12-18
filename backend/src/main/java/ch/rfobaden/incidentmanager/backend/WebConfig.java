package ch.rfobaden.incidentmanager.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    private final RfoConfig rfoConfig;

    public WebConfig(RfoConfig rfoConfig) {
        this.rfoConfig = rfoConfig;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/v1/**")
            .allowedMethods("GET", "HEAD", "POST", "PUT", "PATCH", "DELETE")
            .allowedOrigins(rfoConfig.getFrontend().getHost())
            .allowCredentials(true);
    }
}
