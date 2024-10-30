package com.bus.app.repositorio;


import com.bus.app.modelo.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface ViajeRepositorio extends JpaRepository<Viaje,Long> {

}
