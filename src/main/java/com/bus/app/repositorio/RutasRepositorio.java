package com.bus.app.repositorio;

import com.bus.app.modelo.Ruta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface RutasRepositorio  extends JpaRepository<Ruta,Long> {
}
