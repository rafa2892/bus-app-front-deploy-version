package com.bus.app.modelo;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name="historial")
public class Historial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_tipo")
    private Long idTipo;

    @Column(name = "comentarios")
    private String comentarios;

    @Column(name = "descripcion_tipo")
    private String descripcionTipo;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "carro_id")
    private Carro carro;

    @JoinColumn(name="fecha_alta")
    private Date fechaAlta;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_ID")
    private UserLogin userLogin;


}
