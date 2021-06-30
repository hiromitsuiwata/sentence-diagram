package hiromitsu.sentence.visualization;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.google.gson.Gson;

import hiromitsu.sentence.Edge;
import hiromitsu.sentence.Word;
import hiromitsu.sentence.EdgeTypeString;
import hiromitsu.sentence.Node;
import hiromitsu.sentence.ParsedResult;
import hiromitsu.sentence.infrastructure.JsonUtility;
import lombok.Data;

/**
 * 表示用の結果
 */
@Data
public class ViewMapper {

  private List<VNode> vnodes = new ArrayList<>();
  private List<VEdge> vedges = new ArrayList<>();

  public static List<ViewNode> map(ParsedResult r) {
    List<Edge> edgeList = r.getEdgeList();
    List<Node> nodeList = r.getNodeList();
    List<ViewNode> viewNodes = new ArrayList<>();

    Map<Integer, Integer> childIdMap = new HashMap<>();

    for (int i = 0; i < nodeList.size(); i++) {
      Node node = nodeList.get(i);
      String text = node.getWordList().stream().map(Word::getToken).collect(Collectors.joining(" "));
      ViewNode viewNode = new ViewNode(i, text);
      for (Edge edge : edgeList) {
        if (node.equals(edge.getFrom())) {
          String type = edge.getType();
          int parentId = setSeparator(nodeList, viewNode, edge, type);
          setChildren(childIdMap, viewNode, type, parentId);
        }
      }
      viewNodes.add(viewNode);
    }
    return viewNodes;

  }

  private static int setSeparator(List<Node> nodeList, ViewNode viewNode, Edge edge, String type) {
    viewNode.setRelation(type);
    boolean isRightDown = type.equals(EdgeTypeString.DET) || type.equals(EdgeTypeString.AMOD)
        || type.equals(EdgeTypeString.NMOD_POSS) || type.equals(EdgeTypeString.ADVMOD)
        || type.equals(EdgeTypeString.NEG) || type.equals(EdgeTypeString.NMOD_TMOD);
    if (isRightDown) {
      viewNode.setDirection("right-down");
    } else if (type.equals("nsubj")) {
      viewNode.setSeparator("full");
    } else if (type.equals("dobj")) {
      viewNode.setSeparator("half");
    }
    int parentId = nodeList.indexOf(edge.getTo());
    viewNode.setParentId(parentId);
    return parentId;
  }

  private static void setChildren(Map<Integer, Integer> childIdMap, ViewNode viewNode, String type, int parentId) {
    boolean includesChild = type.equals("det") || type.equals("amod") || type.equals("nmod_tmod") || type.equals("neg");
    if (includesChild) {
      Integer newValue;
      if (childIdMap.containsKey(parentId)) {
        newValue = childIdMap.get(parentId) + 1;
      } else {
        newValue = 0;
      }
      childIdMap.put(parentId, newValue);
      viewNode.setChildOrder(newValue);
    }
  }

  @Deprecated
  public ViewMapper(ParsedResult r) {

    List<Edge> edgeList = r.getEdgeList();
    List<Node> nodeList = r.getNodeList();

    for (Edge edge : edgeList) {
      Node fromNode = edge.getFrom();
      if (!nodeList.contains(fromNode)) {
        nodeList.add(fromNode);
      }
      Node toNode = edge.getTo();
      if (!nodeList.contains(toNode)) {
        nodeList.add(toNode);
      }

      String fromIds = fromNode.getWordIds();
      String toIds = toNode.getWordIds();

      String vtype = null;
      String type = edge.getType();
      // TODO 実際のダイアグラムを見ながら他のタイプに対応する
      if (type.equals(EdgeTypeString.DET) || type.equals(EdgeTypeString.AMOD)) {
        vtype = "mod";
      } else if (type.equals(EdgeTypeString.NSUBJ)) {
        vtype = "subj";
      }

      VEdge vedge = new VEdge(fromIds, toIds, vtype);
      vedges.add(vedge);
    }

    for (Node node : nodeList) {
      String ids = node.getWordIds();
      if (ids == null || ids.isEmpty()) {
        continue;
      }
      String text = node.toPrettyString();
      VNode vnode = new VNode(ids, text);
      vnodes.add(vnode);
    }

  }

  public String toJSON() {
    Gson gson = new Gson();
    return JsonUtility.toJSON(gson.toJson(this));
  }
}
