package hiromitsu.sentence.service;

import javax.enterprise.context.ApplicationScoped;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import hiromitsu.sentence.db.SentenceEntity;

/**
 * 文サービス
 */
@ApplicationScoped
@Transactional
public class SentenceService {

  @PersistenceContext
  private EntityManager em;
  
  /**
   * DBに文を登録する
   * @param sentence
   * @return 自動採番された主キー(id)
   */
  public Long create(Sentence sentence) {
    SentenceEntity entity = new SentenceEntity();
    entity.setText(sentence.getText());
    entity.setUrl(sentence.getUrl());
    em.persist(entity);
    return entity.getId();
  }
}
