package com.bus.app.services;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtUtilService {
    // LLAVE_MUY_SECRETA => [Base64] => TExBVkVfTVVZX1NFQ1JFVEE=

    @Value("${jwt_key}")
    private String jwtSecretKey;

    public static final long JWT_TOKEN_VALIDITY = 1000 * 60 * 20; //20 minuto
    public static final long JWT_REFRESH_TOKEN_VALIDITY = 1000 * 60 * 60 * 24; // 24 horas

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extractAllClaims(token));
    }
    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(jwtSecretKey).parseClaimsJws(token).getBody();
    }
    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    public String generateToken(UserDetails userDetails) {

        Map<String, Object> claims = new HashMap<>();
        // Agregando informacion adicional como "claim"
        var rol = userDetails.getAuthorities().stream().collect(Collectors.toList()).get(0);
        claims.put("rol", rol);
        return generateAccessToken(userDetails);
    }
    private String createToken(Map<String, Object> claims, String subject, long validity) {

        return Jwts
                .builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + validity))
                .signWith(SignatureAlgorithm.HS256, jwtSecretKey)
                .compact();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public String generateAccessToken(UserDetails userDetails) {
        refreshToken = generateRefreshToken(userDetails);
        return createToken(new HashMap<>(), userDetails.getUsername(),JWT_TOKEN_VALIDITY);
    }
    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims,userDetails.getUsername(),JWT_REFRESH_TOKEN_VALIDITY);
    }
    public boolean isExpiredRefreshToken(String token) {
        return isTokenExpired(token);
    }

    public boolean hasLessThanFiveMinutesToExpire(String token) {
        Date expirationDate = extractExpiration(token);
        long timeRemaining = expirationDate.getTime() - System.currentTimeMillis();
        return timeRemaining <= 5 * 60 * 1000; // 5 minutos en milisegundos
    }

    private String refreshToken;

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
