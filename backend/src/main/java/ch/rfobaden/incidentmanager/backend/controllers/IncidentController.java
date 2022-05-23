package ch.rfobaden.incidentmanager.backend.controllers;


import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAgent;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Incident;
import ch.rfobaden.incidentmanager.backend.services.IncidentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * {@code IncidentController} is a {@link ModelController} for {@link Incident incidents}.
 */
@RestController
@RequestMapping(path = "api/v1/incidents")
public class IncidentController extends ModelController.Basic<Incident, IncidentService> {
    /**
     * Closes an incident.
     *
     * @param incidentId The id of the incident that should be closed.
     * @param closeData The close data.
     * @return The closed incident.
     *
     * @throws ApiException {@link HttpStatus#NOT_FOUND} if no matching incident exists.
     */
    @PutMapping("{incidentId}/close")
    @ResponseStatus(HttpStatus.OK)
    public Incident closeIncident(
        @PathVariable Long incidentId,
        @RequestBody CloseData closeData
    ) {
        return service.closeIncident(incidentId, closeData.getMessage())
            .orElseThrow(() -> (
                new ApiException(HttpStatus.NOT_FOUND, "incident not found")
            ));
    }

    /**
     * Reopens an incident.
     *
     * @param incidentId The id of the incident that should be reopened.
     * @return The reopened incident.
     *
     * @throws ApiException {@link HttpStatus#NOT_FOUND} if no matching incident exists.
     */
    @PutMapping("{incidentId}/reopen")
    @ResponseStatus(HttpStatus.OK)
    public Incident reopenIncident(@PathVariable Long incidentId) {
        return service.reopenIncident(incidentId)
            .orElseThrow(() -> (
                new ApiException(HttpStatus.NOT_FOUND, "incident not found")
            ));
    }

    /**
     * Paginates all closed incidents.
     *
     * @param limit The maximum amount of entities to include per page.
     * @param offset The offset of pages.
     * @return The paginated incidents.
     */
    @GetMapping("/archive")
    @ResponseStatus(HttpStatus.OK)
    @RequireAgent
    public IncidentPageData listArchive(
        @RequestParam int limit,
        @RequestParam int offset
    ) {
        var page = service.listClosedIncidents(limit, offset);
        return new IncidentPageData(page.getTotalElements(), page.toList());
    }

    /**
     * {@code CloseData} contains data used to close an incident.
     */
    public static final class CloseData {
        private String message;

        public CloseData() {
        }

        public CloseData(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    /**
     * {@code IncidentPageData} contains a list of paginated incidents.
     */
    public static final class IncidentPageData {
        /**
         * The total amount of incidents of this pagination,
         * including the ones that are not included in this page.
         */
        private final Long total;

        /**
         * The incidents of this page.
         */
        private final List<Incident> data;

        public IncidentPageData(Long total, List<Incident> data) {
            this.total = total;
            this.data = data;
        }

        public Long getTotal() {
            return total;
        }

        public List<Incident> getData() {
            return data;
        }
    }

}
