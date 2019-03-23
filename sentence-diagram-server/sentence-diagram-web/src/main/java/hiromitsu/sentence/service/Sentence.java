package hiromitsu.sentence.service;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;

import lombok.Data;

/**
 * 文エンティティ
 */
@Data
@Entity(name = "SENTENCE")
@NamedQueries({
  @NamedQuery(name = "Sentence.findAll", query = "SELECT s FROM SENTENCE s")
})
public class Sentence {

  @Column
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;
  
  @Column(length = 1024, nullable = false)
  private String text;

  @Column(length = 1024)
  private String url;
}
