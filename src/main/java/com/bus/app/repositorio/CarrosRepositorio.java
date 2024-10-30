package com.bus.app.repositorio;

import com.bus.app.modelo.Carro;
import com.bus.app.modelo.Historial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarrosRepositorio extends JpaRepository<Carro,Long> {
    Historial save(Historial historial);
}
