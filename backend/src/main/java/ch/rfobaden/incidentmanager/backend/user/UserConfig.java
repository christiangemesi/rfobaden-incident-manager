package ch.rfobaden.incidentmanager.backend.user;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

// This is so that there are some users at the beginning can be removed later.
@Configuration
public class UserConfig {

    @Bean
    CommandLineRunner commandLineRunner(UserRepository userRepository) {
        return args -> {
            User george = new User("George", "georgePassword");
            User david = new User("David", "davidPassword");

            userRepository.saveAll(List.of(george, david));
        };
    }
}
