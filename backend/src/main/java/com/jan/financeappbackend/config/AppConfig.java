package com.jan.financeappbackend.config;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.Hibernate;
import org.hibernate.collection.spi.PersistentCollection;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Set;

@Configuration
public class AppConfig {
  @PersistenceContext private EntityManager entityManager;

  @Bean
  public JPAQueryFactory jpaQueryFactory() {
    return new JPAQueryFactory(entityManager);
  }

  @Bean
  public ModelMapper modelMapper(Set<Converter> converters) {
    ModelMapper modelMapper = new ModelMapper();
    converters.forEach(modelMapper::addConverter);

    modelMapper
        .getConfiguration()
        .setPropertyCondition(
            context -> {
              if (context.getSource() instanceof PersistentCollection) {
                return Hibernate.isInitialized(context.getSource());
              }
              return true;
            });

    return modelMapper;
  }
}
