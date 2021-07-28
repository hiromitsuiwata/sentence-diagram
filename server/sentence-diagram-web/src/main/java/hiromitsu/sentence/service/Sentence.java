package hiromitsu.sentence.service;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import lombok.Data;

/**
 * 文エンティティ
 */
@Data
@Entity(name = "sentence")
@NamedQuery(name = "Sentence.findAll", query = "SELECT s FROM sentence s")
@NamedQuery(name = "Sentence.search", query = "SELECT s FROM sentence s WHERE (lower(s.title) LIKE lower(:keyword)) OR (lower(s.text) LIKE lower(:keyword)) OR (lower(s.url) LIKE lower(:keyword))")
@Schema(name = "Sentence", description = "sentence")
public class Sentence {

  private static final int COLUMN_LENGTH = 1024;

  @Column
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Schema(required = true)
  private long id;

  @Column(length = COLUMN_LENGTH, nullable = true)
  private String title;

  @Column(length = COLUMN_LENGTH, nullable = false)
  @Schema(required = true)
  private String text;

  @Column(length = COLUMN_LENGTH, nullable = true)
  private String url;
}
