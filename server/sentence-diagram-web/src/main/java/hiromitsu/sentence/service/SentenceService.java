package hiromitsu.sentence.service;

import java.util.ArrayList;
import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import hiromitsu.sentence.Analyzer;
import hiromitsu.sentence.ParsedResult;
import hiromitsu.sentence.visualization.ViewMapper;
import hiromitsu.sentence.visualization.ViewNode;

/**
 * 文サービス
 */
@ApplicationScoped
@Transactional
public class SentenceService {

  private static final Logger LOGGER = LogManager.getLogger();

  @PersistenceContext
  private EntityManager em;

  /**
   * DBに文を登録する
   *
   * @param sentence
   * @return 自動採番された主キー(id)を含むsentence
   */
  public Sentence create(Sentence sentence) {
    em.persist(sentence);
    return sentence;
  }

  /**
   * 全件検索する
   *
   * @return 検索結果
   */
  public List<Sentence> findAll() {
    if (em == null) {
      LOGGER.info("entityManager is null");
      return new ArrayList<>();
    }
    TypedQuery<Sentence> query = em.createNamedQuery("Sentence.findAll", Sentence.class);
    return query.getResultList();
  }

  /**
   * 主キー検索する
   *
   * @param id 主キー
   * @return 検索結果
   */
  public Sentence find(Long id) {
    return em.find(Sentence.class, id);
  }

  /**
   * 主キーで削除する
   *
   * @param id 主キー
   * @return 検索結果
   */
  public Sentence delete(Long id) {
    Sentence s = em.find(Sentence.class, id);
    em.remove(s);
    return s;
  }

  public List<Sentence> search(String text) {
    TypedQuery<Sentence> query = em.createNamedQuery("Sentence.search", Sentence.class).setParameter("keyword",
        "%" + text + "%");
    return query.getResultList();
  }

  public String createDiagram(Long id) {

    Sentence sentence = em.find(Sentence.class, id);
    String text = sentence.getText();

    List<ParsedResult> results = Analyzer.analyze(text);
    List<ViewNode> vns = ViewMapper.map(results.get(0));

    Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
    return gson.toJson(vns);
  }
}
