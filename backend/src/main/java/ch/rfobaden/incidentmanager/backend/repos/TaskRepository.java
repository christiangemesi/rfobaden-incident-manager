package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.models.Task;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.models.paths.TaskPath;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, ModelRepository<Task, TaskPath> {

    @Query(
        "SELECT CASE WHEN COUNT(task) > 0 THEN true ELSE false END "
            + " FROM "
            + "Task task"
            + " WHERE "
            + "task.report.incident.id = :#{#path.incidentId}"
            + " AND "
            + "task.report.id = :#{#path.reportId}"
            + " AND "
            + "task.id = :id"
    )
    @Override
    boolean existsByPath(TaskPath path, Long id);

    @Query(
        "SELECT task "
            + " FROM "
            + "Task task"
            + " WHERE "
            + "task.report.incident.id = :#{#path.incidentId}"
            + " AND "
            + "task.report.id = :#{#path.reportId}"
            + " AND "
            + "task.id = :id"
    )
    @Override
    Optional<Task> findByPath(@Param("path") TaskPath path, @Param("id") Long id);

    @Query(
        "SELECT task "
            + " FROM "
            + "Task task"
            + " WHERE "
            + "task.report.incident.id = :#{#path.incidentId}"
            + " AND "
            + "task.report.id = :#{#path.reportId}"
    )

    @Override
    List<Task> findAllByPath(@Param("path") TaskPath path);

    /**
     * Loads all assigned {@link Task tasks} over all opened {@link Incident incidents}.
     *
     * @param id The id of the {@link User assignee}.
     * @return The list of assigned tasks.
     */
    @Query(
        "SELECT task "
            + " FROM "
            + "Task task"
            + " WHERE "
            + "task.assignee.id = :id"
            + " AND "
            + "task.report.incident.isClosed = false "
            + "ORDER BY task.report.incident.id"
    )
    List<Task> findAllByAssigneeId(@Param("id") Long id);
}
