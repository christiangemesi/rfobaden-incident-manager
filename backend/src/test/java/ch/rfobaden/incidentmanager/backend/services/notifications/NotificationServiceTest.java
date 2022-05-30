package ch.rfobaden.incidentmanager.backend.services.notifications;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import ch.rfobaden.incidentmanager.backend.TestConfig;
import ch.rfobaden.incidentmanager.backend.test.generators.ReportGenerator;
import ch.rfobaden.incidentmanager.backend.test.generators.UserGenerator;
import org.junit.jupiter.api.RepeatedTest;
import org.mockito.Answers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

@SpringBootTest
@Import(TestConfig.class)
class NotificationServiceTest {
    @MockBean(answer = Answers.CALLS_REAL_METHODS)
    NotificationService service;

    @Autowired
    ReportGenerator reportGenerator;

    @Autowired
    UserGenerator userGenerator;

    @RepeatedTest(5)
    void testNotifyAssigneeIfChanged_newEntityNoAssignee() {
        // Given
        var entity = reportGenerator.generate();
        entity.setAssignee(null);

        // When
        service.notifyAssigneeIfChanged(null, entity);

        // Then
        verify(service, never()).notifyAssignee(any(), any());
    }

    @RepeatedTest(5)
    void testNotifyAssigneeIfChanged_newEntityWithAssignee() {
        // Given
        var entity = reportGenerator.generate();
        entity.setAssignee(userGenerator.generate());

        // When
        service.notifyAssigneeIfChanged(null, entity);

        // Then
        verify(service, times(1)).notifyAssignee(entity, entity.getAssignee());
    }

    @RepeatedTest(5)
    void testNotifyAssigneeIfChanged_existingEntityNoAssignee() {
        // Given
        var oldEntity = reportGenerator.generate();
        var entity = reportGenerator.copy(oldEntity);
        oldEntity.setAssignee(null);
        entity.setAssignee(null);

        // When
        service.notifyAssigneeIfChanged(oldEntity, entity);

        // Then
        verify(service, never()).notifyAssignee(any(), any());
    }

    @RepeatedTest(5)
    void testNotifyAssigneeIfChanged_existingEntitySameAssignee() {
        // Given
        var oldEntity = reportGenerator.generate();
        oldEntity.setAssignee(userGenerator.generate());
        var entity = reportGenerator.copy(oldEntity);

        // When
        service.notifyAssigneeIfChanged(oldEntity, entity);

        // Then
        verify(service, never()).notifyAssignee(any(), any());
    }

    @RepeatedTest(5)
    void testNotifyAssigneeIfChanged_existingEntityNewAssignee() {
        // Given
        var oldEntity = reportGenerator.generate();
        var entity = reportGenerator.copy(oldEntity);
        entity.setAssignee(userGenerator.generate());

        // When
        service.notifyAssigneeIfChanged(oldEntity, entity);

        // Then
        verify(service, times(1)).notifyAssignee(entity, entity.getAssignee());
    }

    @RepeatedTest(5)
    void testNotifyAssigneeIfChanged_existingEntityDifferentAssignee() {
        // Given
        var oldEntity = reportGenerator.generate();
        var entity = reportGenerator.copy(oldEntity);
        oldEntity.setAssignee(userGenerator.generate());
        entity.setAssignee(userGenerator.generate());

        // When
        service.notifyAssigneeIfChanged(oldEntity, entity);

        // Then
        verify(service, times(1)).notifyAssignee(entity, entity.getAssignee());
    }
}
