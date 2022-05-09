package ch.rfobaden.incidentmanager.backend.repos;

import ch.rfobaden.incidentmanager.backend.models.Subtask;
import ch.rfobaden.incidentmanager.backend.models.paths.SubtaskPath;
import ch.rfobaden.incidentmanager.backend.repos.base.ModelRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubtaskRepository
    extends JpaRepository<Subtask, Long>, ModelRepository<Subtask, SubtaskPath> {

    @Query(
        "SELECT CASE WHEN COUNT(subtask) > 0 THEN true ELSE false END "
            + " FROM "
            + "Subtask subtask"
            + " WHERE "
            + "subtask.task.report.incident.id = :#{#path.incidentId}"
            + " AND "
            + "subtask.task.report.id = :#{#path.reportId}"
            + " AND "
            + "subtask.task.id = :#{#path.taskId}"
            + " AND "
            + "subtask.id = :id"
    )
    @Override
    boolean existsByPath(SubtaskPath path, Long id);

    @Query(
        "SELECT subtask "
            + " FROM "
            + "Subtask subtask"
            + " WHERE "
            + "subtask.task.report.incident.id = :#{#path.incidentId}"
            + " AND "
            + "subtask.task.report.id = :#{#path.reportId}"
            + " AND "
            + "subtask.task.id = :#{#path.taskId}"
            + " AND "
            + "subtask.id = :id"
    )
    @Override
    Optional<Subtask> findByPath(@Param("path") SubtaskPath path, @Param("id") Long id);

    @Query(
        "SELECT subtask "
            + " FROM "
            + "Subtask subtask"
            + " WHERE "
            + "subtask.task.report.incident.id = :#{#path.incidentId}"
            + " AND "
            + "subtask.task.report.id = :#{#path.reportId}"
            + " AND "
            + "subtask.task.id = :#{#path.taskId}"
    )

    @Override
    List<Subtask> findAllByPath(@Param("path") SubtaskPath path);

    @Query(
        "SELECT subtask "
            + " FROM "
            + "Subtask subtask"
            + " WHERE "
            + "subtask.assignee.id = :id"
            + " AND "
            + "subtask.task.report.incident.isClosed = false "
            + "ORDER BY subtask.task.report.incident.id"
    )
    List<Subtask> findAllByAssigneeId(@Param("id") Long id);
}
