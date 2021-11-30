package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT task FROM Task task "
        + "WHERE task.id = :id AND task.report.id = :reportId")
    Optional<Task> findByIdOfReport(
        @Param("reportId") Long reportId, @Param("id") Long id
    );

    @Query("SELECT task FROM Task task WHERE task.report.id = :reportId")
    List<Task> findAllOfReport(@Param("reportId") Long incidentId);
}
