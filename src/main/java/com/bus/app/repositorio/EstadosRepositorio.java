package com.bus.app.repositorio;

import com.bus.app.modelo.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
public interface EstadosRepositorio extends JpaRepository<Estado,Long> {


}



