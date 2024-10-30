package com.bus.app.repositorio;

import com.bus.app.modelo.UserLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface UsuariosRepositorio extends JpaRepository<UserLogin,Long> {
    UserLogin getUsuarioById(Long id);

    UserLogin getUsuarioByUsu(String usu);
}
