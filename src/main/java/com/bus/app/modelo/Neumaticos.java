package com.bus.app.modelo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "neumaticos")
public class Neumaticos {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "carro_id", nullable = false)
    private Carro carro;

    private String marca;

    private String modelo;

    private String medida;

    private String observaciones;

    private String fechaInstalacion;

    private String fechaRetiro;

    private String estado;

    private boolean requiereCambio;

}