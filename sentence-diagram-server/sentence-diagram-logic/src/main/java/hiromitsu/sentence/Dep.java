package hiromitsu.sentence;

import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/**
 * CoreNLPにおけるdependencyパース結果
 */
@AllArgsConstructor
@ToString
@Getter
@Setter
public class Dep {
  private Integer from;
  private Integer to;
  private String relation;
}
