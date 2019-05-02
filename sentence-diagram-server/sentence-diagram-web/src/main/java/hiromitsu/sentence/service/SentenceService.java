package hiromitsu.sentence.service;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import hiromitsu.sentence.CoreNLPWrapper;
import hiromitsu.sentence.ParsedResult;

/**
 * 文サービス
 */
@ApplicationScoped
@Transactional
public class SentenceService {

  private static Logger logger = LoggerFactory.getLogger(SentenceService.class);

  @PersistenceContext
  private EntityManager em;
  
  /**
   * DBに文を登録する
   * @param sentence
   * @return 自動採番された主キー(id)
   */
  public Long create(Sentence sentence) {
    em.persist(sentence);
    return sentence.getId();
  }
  
  /**
   * 全件検索する
   * @return 検索結果
   */
  public List<Sentence> findAll() {
    TypedQuery<Sentence> query = em.createNamedQuery("Sentence.findAll", Sentence.class);
    return query.getResultList();
  }
  
  /**
   * 主キー検索する
   * @param id 主キー
   * @return　検索結果
   */
  public Sentence find(Long id) {
    return em.find(Sentence.class, id);
  }
  
  public Sentence createDiagram(Long id) {
    Sentence sentence = em.find(Sentence.class, id);
    CoreNLPWrapper nlp = CoreNLPWrapper.getInstance();
    List<ParsedResult> result = nlp.parse(sentence.getText());
    result.forEach(r -> {
      logger.info(r.getOriginalSentence().toString());
      logger.info(r.getConstituents().toString());
      logger.info(r.getConstituentyText().toString());
      logger.info(r.getDependencies().toString());
//      logger.info(r.getLemmas().toString());
//      logger.info(r.getPosTags().toString());
//      logger.info(r.getTokens().toString());      
    });
    return sentence;
  }
}
