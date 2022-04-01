package ch.rfobaden.incidentmanager.backend.controllers.base;


import ch.rfobaden.incidentmanager.backend.TestConfig;
import ch.rfobaden.incidentmanager.backend.WebConfig;
import ch.rfobaden.incidentmanager.backend.WebSecurityConfig;
import ch.rfobaden.incidentmanager.backend.controllers.helpers.JwtHelper;
import ch.rfobaden.incidentmanager.backend.controllers.helpers.SessionHelper;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

@Import({
    TestConfig.class,
    WebConfig.class,
    WebSecurityConfig.class,
    JwtHelper.class,
    SessionHelper.class,
    AppControllerTest.MockUserServiceConfig.class
})
public abstract class AppControllerTest {
    @TestConfiguration
    @ConditionalOnProperty(value = "app.mock-user-service", matchIfMissing = true)
    public static class MockUserServiceConfig {
        // Required so the filter chain gets a UserService bean.
        // It doesn't matter that this mock does not actually do anything,
        // as long as the request does not contain auth details,
        // in which case the test method is responsible for correct mocking.
        @MockBean
        protected UserService userService;
    }
}
