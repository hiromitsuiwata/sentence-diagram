package hiromitsu.sentence.service;

import java.util.List;
import java.util.stream.Collectors;

import javax.enterprise.context.ApplicationScoped;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;

import com.google.gson.Gson;

import hiromitsu.sentence.Analyzer;
import hiromitsu.sentence.ParsedResult;
import hiromitsu.sentence.visualization.VResult;

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
    List<VResult> vresults = results.stream().map(r -> new VResult(r)).collect(Collectors.toList());

    Gson gson = new Gson();
    String json = gson.toJson(vresults);

    return json;
  }
}
