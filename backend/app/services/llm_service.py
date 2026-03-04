import httpx
import json
from ..core.config import settings

PROMPTS = {
    "analysis": "你是一个学习规划专家。请分析以下学习需求，给出：1.关键要点 2.推荐学习路径。\n需求：{goal}\n背景：{background}\n请用JSON格式返回：{{\"analysis_result\":\"...\",\"key_points\":\"...\",\"recommended_path\":\"...\"}}",
    "stages": "你是一个学习规划专家。请根据以下信息制定学习阶段计划。\n目标：{goal}\n背景：{background}\n总天数：{days}\n难度：{difficulty}\n分析结果：{analysis}\n请用JSON数组格式返回：[{{\"stage_name\":\"...\",\"description\":\"...\",\"duration_days\":N,\"milestones\":\"...\"}}]",
    "resources": "你是一个学习资源推荐专家。请为以下学习阶段推荐资源。\n阶段：{stage_name}\n描述：{description}\n请用JSON数组格式返回：[{{\"resource_type\":\"...\",\"title\":\"...\",\"description\":\"...\",\"url\":\"...\",\"provider\":\"...\",\"estimated_hours\":N,\"difficulty\":\"...\",\"is_free\":true}}]",
    "methods": "你是一个学习方法专家。请为以下学习阶段推荐学习方式。\n阶段：{stage_name}\n描述：{description}\n资源：{resources}\n请用JSON数组格式返回：[{{\"method_type\":\"...\",\"title\":\"...\",\"content\":\"...\",\"schedule\":\"...\"}}]",
}

async def call_deepseek(prompt: str) -> str:
    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(
            f"{settings.DEEPSEEK_API_URL}/chat/completions",
            headers={"Authorization": f"Bearer {settings.DEEPSEEK_API_KEY}", "Content-Type": "application/json"},
            json={"model": "deepseek-reasoner", "messages": [{"role": "user", "content": prompt}], "temperature": 0.7},
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]

def parse_json_response(text: str):
    text = text.strip()
    # 移除markdown代码块标记
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0]
    elif "```" in text:
        text = text.split("```")[1].split("```")[0]

    # 移除可能的markdown标题标记
    lines = text.split('\n')
    cleaned_lines = []
    for line in lines:
        # 跳过以###开头的markdown标题行
        if line.strip().startswith('###'):
            continue
        cleaned_lines.append(line)

    text = '\n'.join(cleaned_lines).strip()

    # 尝试找到JSON数组或对象的开始和结束
    start_idx = text.find('[')
    if start_idx == -1:
        start_idx = text.find('{')

    if start_idx != -1:
        # 找到对应的结束符号
        if text[start_idx] == '[':
            end_idx = text.rfind(']')
            if end_idx != -1:
                text = text[start_idx:end_idx+1]
        else:
            end_idx = text.rfind('}')
            if end_idx != -1:
                text = text[start_idx:end_idx+1]

    return json.loads(text.strip())
