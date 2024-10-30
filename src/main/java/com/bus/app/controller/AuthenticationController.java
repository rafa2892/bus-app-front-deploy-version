package com.bus.app.controller;

import com.bus.app.modelo.AuthenticationReq;
import com.bus.app.modelo.TokenInfo;
import com.bus.app.modelo.TokenInfoTwoParameters;
import com.bus.app.services.JwtUtilService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/")
@CrossOrigin
public class AuthenticationController {

    @Autowired
    private JwtUtilService jwtUtilService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    UserDetailsService usuarioDetailsService;
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody AuthenticationReq authenticationReq,
    HttpServletResponse response) {
        logger.info("Autenticando al usuario {}", authenticationReq.getUsuario());

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authenticationReq.getUsuario(),
                            authenticationReq.getClave()));

            final UserDetails userDetails = usuarioDetailsService.loadUserByUsername(authenticationReq.getUsuario());
            final String jwt = jwtUtilService.generateToken(userDetails);
            final String refreshToken = jwtUtilService.generateRefreshToken(userDetails);

            if (refreshToken != null && !refreshToken.isEmpty()) {
                return ResponseEntity.ok(new TokenInfoTwoParameters(jwt, refreshToken));
            }
        }catch (BadCredentialsException e) {
            logger.error("Credenciales inválidas para el usuario {}", authenticationReq.getUsuario());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciales inválidas. Por favor, verifica tu usuario y contraseña.");
        }
        catch (Exception e){
            logger.error(e.getLocalizedMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenInfo> refresh(@RequestBody String refreshToken) {

        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Validar el refresh token
        if (jwtUtilService.isTokenExpired(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Obtener los detalles del usuario y generar un nuevo JWT
        String userName = jwtUtilService.extractUsername(refreshToken);
        UserDetails userDetails =  usuarioDetailsService.loadUserByUsername(userName);
        final String jwtRefreshed = jwtUtilService.generateToken(userDetails);
        return ResponseEntity.ok(new TokenInfo(jwtRefreshed));
    }
    @GetMapping("/authenticationTest")
    public ResponseEntity<String> prueba() {
        return ResponseEntity.ok("Estas autenticado correctamente");
    }
}