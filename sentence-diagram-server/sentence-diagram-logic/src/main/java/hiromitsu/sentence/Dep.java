package hiromitsu.sentence;

import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * CoreNLPにおけるdependencyパース結果
 */
@AllArgsConstructor
public class Dep {
	@Setter
	@Getter
	private Integer src;
	@Setter
	@Getter
	private Integer tgt;
	@Setter
	@Getter
	private String relation;
}
