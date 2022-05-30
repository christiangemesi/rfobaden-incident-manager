package ch.rfobaden.incidentmanager.backend.controllers.base.filters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * {@code ExceptionHandlerFilter} catches exceptions thrown in the filter chain
 * and handles them using the configured {@link HandlerExceptionResolver}.
 */
@Component
public class ExceptionHandlerFilter extends OncePerRequestFilter {
    private final Logger log = LoggerFactory.getLogger(getClass());

    private final HandlerExceptionResolver resolver;

    public ExceptionHandlerFilter(
        @Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver
    ) {
        this.resolver = resolver;
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain chain
    ) {
        try {
            chain.doFilter(request, response);
        } catch (Exception e) {
            resolver.resolveException(request, response, null, e);
            if (response.getStatus() >= 500) {
                log.error("Exception in Filter Chain: ", e);
            }
        }
    }
}
