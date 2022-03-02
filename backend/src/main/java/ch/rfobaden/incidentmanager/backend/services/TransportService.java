package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Transport;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.repos.TransportRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class TransportService
    extends ModelRepositoryService.Basic<Transport, TransportRepository> {
}
