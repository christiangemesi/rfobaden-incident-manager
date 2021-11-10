package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.controllers.helpers.SessionCookieHelper;
import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping(path = "api/v1/users")
public final class UserController extends ModelController<User, UserService> {
    private final SessionCookieHelper cookieHelper;

    public UserController(
        UserService service,
        SessionCookieHelper cookieHelper
    ) {
        super(service);
        this.cookieHelper = cookieHelper;
    }

    @PutMapping("/current/password")
    @ResponseStatus(HttpStatus.OK)
    public User updatePassword(
        @RequestBody PasswordData data,
        HttpServletRequest request,
        HttpServletResponse response
    ) {
        var cookie = cookieHelper.findCookie(request);
        var session = cookieHelper.parseSessionFromCookie(cookie);
        var user = cookieHelper.findSessionUser(session);
        user = service.updatePassword(user, data.password).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "record not found")
        ));
        cookieHelper.setCookie(session, request, response, (newCookie) -> {
            newCookie.setMaxAge(cookie.getMaxAge());
        });
        return user;
    }

    public static final class PasswordData {
        private final String password;

        public PasswordData(String password) {
            this.password = password;
        }
    }
}
