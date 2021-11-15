package ch.rfobaden.incidentmanager.backend.controllers;

import ch.rfobaden.incidentmanager.backend.controllers.base.ModelController;
import ch.rfobaden.incidentmanager.backend.models.User;
import ch.rfobaden.incidentmanager.backend.services.UserService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/v1/users")
public class UserController extends ModelController<User, UserService> {
    public UserController(UserService service) {
        super(service);
    }

//    @PutMapping("/current/password")
//    @ResponseStatus(HttpStatus.OK)
//    public User updatePassword(
//        @RequestBody PasswordData data,
//        HttpServletRequest request,
//        HttpServletResponse response
//    ) {
//        var cookie = cookieHelper.findCookie(request);
//        var session = cookieHelper.parseSessionFromCookie(cookie);
//        var user = cookieHelper.findSessionUser(session);
//        user = service.updatePassword(user, data.password).orElseThrow(() -> (
//            new ApiException(HttpStatus.NOT_FOUND, "record not found")
//        ));
//
//        // Set new session, so the token stays valid.
//        // Sessions of other clients will be invalid from here on out.
//        var newSession = new Session(user.getId());
//        cookieHelper.setCookie(newSession, request, response, (newCookie) -> {
//            newCookie.setMaxAge(cookie.getMaxAge());
//        });
//        return user;
//    }
//
//    public static final class PasswordData {
//        private String password;
//
//        public PasswordData() {}
//
//        public PasswordData(String password) {
//            this.password = password;
//        }
//
//        public String getPassword() {
//            return password;
//        }
//
//        public void setPassword(String password) {
//            this.password = password;
//        }
//    }
}
