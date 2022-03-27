package ch.rfobaden.incidentmanager.backend.services.notifications;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.catchThrowable;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import ch.rfobaden.incidentmanager.backend.TestConfig;
import ch.rfobaden.incidentmanager.backend.errors.MailException;
import ch.rfobaden.incidentmanager.backend.test.generators.ReportGenerator;
import ch.rfobaden.incidentmanager.backend.test.generators.UserGenerator;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.RepeatedTest;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.mail.javamail.JavaMailSender;

import javax.mail.internet.MimeMessage;

@SpringBootTest
@Import(TestConfig.class)
public class EmailNotificationServiceTest {
    @Autowired
    EmailNotificationService service;

    @Autowired
    ReportGenerator reportGenerator;

    @Autowired
    UserGenerator userGenerator;

    @Autowired
    Faker faker;

    @MockBean
    JavaMailSender sender;

    @Mock
    MimeMessage message;

    @BeforeEach
    void mockSender() {
        Mockito.when(sender.createMimeMessage())
            .thenReturn(message);
        doNothing().when(sender).send((MimeMessage) any());
    }

    @RepeatedTest(5)
    void testNotifyNewUser() {
        // Given
        var user = userGenerator.generate();

        // When
        service.notifyNewUser(user, faker.internet().password());

        // Then
        verify(sender, times(1)).send(message);
    }

    @RepeatedTest(5)
    void testNotifyAssignee() {
        // Given
        var entity = reportGenerator.generate();
        entity.setAssignee(userGenerator.generate());

        // When
        service.notifyAssignee(entity, entity.getAssignee());

        // Then
        verify(sender, times(1)).send(message);
    }

    @RepeatedTest(5)
    void testNotifyAssignee_sendException() {
        // Given
        var entity = reportGenerator.generate();
        entity.setAssignee(userGenerator.generate());

        var e = new MailException(faker.medical().medicineName());
        Mockito.doThrow(e).when(sender).send((MimeMessage) any());

        // When
        var result = catchThrowable(() -> service.notifyAssignee(entity, entity.getAssignee()));

        // Then
        assertThat(result)
            .isNotNull()
            .isInstanceOf(MailException.class)
            .hasMessage(e.getMessage());
    }
}
