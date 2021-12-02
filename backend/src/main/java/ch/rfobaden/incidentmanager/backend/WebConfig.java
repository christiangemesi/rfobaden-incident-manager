package ch.rfobaden.incidentmanager.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/v1/**")
            .allowedMethods("GET", "HEAD", "POST", "PUT", "PATCH", "DELETE")
            .allowedOrigins("http://localhost:3000", "http://86.119.40.19:3000/", "http://86.119.40.19:4000/")
            .allowCredentials(true);
    }
}