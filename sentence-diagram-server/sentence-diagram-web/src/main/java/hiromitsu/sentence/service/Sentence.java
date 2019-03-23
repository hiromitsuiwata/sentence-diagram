package hiromitsu.sentence.db;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;

/**
 * 文エンティティ
 */
@Data
@Entity(name = "SENTENCE")
public class SentenceEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;
  
  private String text;
  private String url;
}
