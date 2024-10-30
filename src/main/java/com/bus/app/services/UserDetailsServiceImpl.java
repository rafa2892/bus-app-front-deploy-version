package com.bus.app.services;

import com.bus.app.modelo.UserLogin;
import com.bus.app.repositorio.UsuariosRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {


    @Autowired
    UsuariosRepositorio usuariosRepositorio;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

      UserLogin user =  usuariosRepositorio.getUsuarioByUsu(username);

        if (user == null) {
            throw new UsernameNotFoundException(username);
        }
        return User
                .withUsername(username)
                .password(user.getPass())
                .roles(user.getRol())
                .build();
    }

}























//package com.app.contador.services;
//import com.app.contador.controller.CarroControlador;
//import com.app.contador.modelo.UserLogin;
//import com.app.contador.repositorio.UsuariosRepositorio;
//import org.apache.logging.log4j.LogManager;
//import org.apache.logging.log4j.Logger;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//@Service
//public class UserDetailsServiceImpl implements UserDetailsService {
//
//    @Autowired
//    UsuariosRepositorio usuariosRepositorio;
//
//    private static final Logger logger = LogManager.getLogger(UserDetailsServiceImpl.class.getName());
////    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//
////        UserLogin usuario =  usuariosRepositorio.getUsuarioByUsu(username);
//
//
//        UserLogin usuario = new UserLogin();
//        var pass = "$2a$10$xLJ9TU1sfY0KFJmsHqeIteEuMjKNonNf2a6gNBznHgua590FcbuNS";
//
//        usuario.setUsu("roberto");
//        usuario.setPass(pass);
//        usuario.setRol("admin");
//
//
//        if(usuario == null) {
//            throw new UsernameNotFoundException(username);
//        }
//
//        return User
//                .withUsername(username)
//                .password(usuario.getPass())
//                .roles("admin")
//                .build();
//    }
//}
