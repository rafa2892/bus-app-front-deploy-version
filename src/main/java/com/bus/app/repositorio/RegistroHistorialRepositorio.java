package com.bus.app.repositorio;

import com.bus.app.modelo.Historial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegistroHistorialRepositorio  extends JpaRepository<Historial,Long> {
}
