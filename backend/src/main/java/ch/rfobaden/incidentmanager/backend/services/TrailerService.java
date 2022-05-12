package ch.rfobaden.incidentmanager.backend.services;

import ch.rfobaden.incidentmanager.backend.models.Trailer;
import ch.rfobaden.incidentmanager.backend.repos.TrailerRepository;
import ch.rfobaden.incidentmanager.backend.services.base.ModelRepositoryService;

import java.util.List;
import java.util.Optional;

public class TrailerService
    extends ModelRepositoryService.Basic<Trailer, TrailerRepository> {

    public List<Trailer> listVisible() {
        return repository.findAllVisible();
    }

    public Optional<Trailer> findByName(String name) {
        return repository.findByName(name);
    }
}
