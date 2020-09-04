package hiromitsu.sentence;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import lombok.Data;

/**
 * 単語
 */
@Data
public class Word {

  private String token;
  private String lemma;
  private String posTag;
  private int index;
  private int maxLength;

  public Word(String token, String lemma, String posTag, int index) {
    this.token = token;
    this.lemma = lemma;
    this.posTag = posTag;
    this.index = index;

    List<Integer> lengthList = Arrays.asList(token.length(), lemma.length(), posTag.length());
    Optional<Integer> m = lengthList.stream().max(Comparator.naturalOrder());
    if (m.isPresent()) {
      this.maxLength = m.get();
    }
  }
}
