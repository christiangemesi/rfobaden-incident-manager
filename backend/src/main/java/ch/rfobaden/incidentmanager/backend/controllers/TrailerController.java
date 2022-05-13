package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.controllers.base.annotations.RequireAgent;
import ch.rfobaden.incidentmanager.backend.models.Trailer;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.services.TrailerService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/trailers")
public class TrailerController
    extends ModelController.Basic<Trailer, TrailerService> {

    public TrailerController() {
    }

    @GetMapping("visible")
    @ResponseStatus(HttpStatus.OK)
    @RequireAgent
    public List<Trailer> listVisible() {
        return service.listVisible();
    }

    @Override
    @RequireAgent
    public Trailer create(@ModelAttribute EmptyPath path, @RequestBody Trailer entity) {
        var trailer = service.findByName(entity.getName().toLowerCase()).orElse(null);
        if (trailer != null) {
            trailer.setVisible(true);
            return super.update(path, trailer.getId(), trailer);
        }
        return super.create(path, entity);
    }

    @Override
    @RequireAgent
    public Trailer update(
        @ModelAttribute EmptyPath emptyPath,
        @PathVariable Long id,
        @RequestBody Trailer entity
    ) {
        return super.update(emptyPath, id, entity);
    }

    @Override
    @RequireAgent
    public Trailer find(@ModelAttribute EmptyPath emptyPath, @PathVariable Long id) {
        return super.find(emptyPath, id);
    }

    @Override
    @RequireAgent
    public List<Trailer> list(@ModelAttribute EmptyPath emptyPath) {
        return super.list(emptyPath);
    }
}
