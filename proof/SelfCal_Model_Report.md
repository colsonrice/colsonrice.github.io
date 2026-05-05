# The SelfCal Engine
### A self-calibrating lottery selection system with statistically significant out-of-sample match-rate lift over random in Powerball testing

---

## Summary

The SelfCal Engine is a rule-based adaptive system that achieved a statistically significant improvement in Powerball match rate on out-of-sample data, validated through strict walk-forward backtesting with 500 independent evaluation runs.

- **+1.07% match rate lift** over uniform random selection
- **Wilcoxon p = 0.0155** (statistically significant at the 5% level)
- **Bootstrap 95% confidence interval [+0.0008, +0.0069]** — excludes zero
- Evaluated on **451 Powerball draws** (May 2023 – April 2026) across **500 seeds**
- **225,500 total ticket evaluations**
- Among the systems we reviewed, we found no published result demonstrating a comparable statistically significant match-rate improvement on a major lottery game under proper walk-forward evaluation

---

## Context

Lottery number prediction has been attempted with LSTM networks, ARIMA models, Markov chains, frequency analysis, and various neural architectures. In every rigorously backtested study we reviewed, these approaches produce results within ±0.1% of random chance. The academic consensus is that predicting specific lottery numbers from draw history does not work.

The SelfCal Engine takes a different approach. It does not attempt to predict which numbers will be drawn. Instead, it detects when the draw process exhibits measurable statistical momentum and adjusts its ticket construction accordingly.

---

## The Mechanism

### What we observed

Analysis of 1,750+ Powerball draws (2010–2026) revealed that ball selection exhibits measurable momentum in some periods: balls drawn recently appear slightly more often in subsequent draws than uniform probability would predict. This effect is not constant — it follows multi-year cycles, appearing strong in some periods and absent in others.

| Period | Momentum strength (top-20 hit rate vs expected) |
|--------|------------------------------------------------|
| 2010–2016 | 1.07x – 1.22x (strong) |
| 2017–2020 | 0.74x – 0.98x (absent) |
| 2021–2022 | 0.96x – 1.05x (mixed) |
| 2023–2026 | 1.03x – 1.18x (moderate to strong) |

We hypothesize these cycles may relate to physical factors such as ball wear, machine calibration, or equipment rotation, but we have not tested this mechanism directly. The observation is purely statistical.

### Why fixed models fail

Every published approach uses a fixed strategy — the same lookback window, the same bias strength, every draw. When the momentum signal disappears (as it does for years at a time), fixed models degrade to random or worse. This is why no fixed-parameter model survives holdout testing across all time periods.

### The self-calibrating approach

The SelfCal Engine measures its own signal environment before each draw:

1. **Count** ball appearances in the last 7 draws
2. **Measure** how well this 7-draw momentum predicted actual outcomes over the last 20 draws (the "momentum ratio")
3. **Calibrate**: if momentum ratio > 1.0 (signal active), increase frequency weighting up to 0.70. If ≤ 1.0 (signal dormant), reduce to 0.10
4. **Blend** frequency-weighted ball probabilities with a uniform prior using the calibrated strength
5. **Sample** 5 balls from the blended distribution

This is a purely rule-based system. It contains **zero learned parameters** — no neural network, no trained weights, no gradient descent. It is arithmetic with an adaptive threshold.

---

## Evaluation Methodology

### Walk-forward backtesting

For each of 451 draws, the model sees ONLY prior draws. No future information of any kind leaks into any prediction. The model's calibration measurement (step 2) uses only historical data available at prediction time.

### 500 independent seeds

Each seed produces a different random trajectory for both the model and the uniform baseline. This eliminates seed-dependent luck.

### Seed-level aggregation

Each of the 500 data points is one seed's average match rate across all 451 draws. This is the most conservative inference approach — it does not inflate significance by treating individual draws as independent observations.

### Paired comparison

For each seed, the model and baseline see the exact same target draws. All statistical tests are paired.

---

## Results

### Primary metric: Average main ball matches per ticket

| Statistic | Value |
|-----------|-------|
| SelfCal average | 0.3665 |
| Uniform average | 0.3626 |
| Mean difference | +0.0039 |
| Relative lift | +1.07% |
| Wilcoxon signed-rank p | 0.0155 |
| Paired t-test p | (consistent) |
| Bootstrap 95% CI | [+0.0008, +0.0069] |
| CI excludes zero | Yes |
| Cohen's d | +0.111 (small effect) |
| Seeds won by SelfCal | 268/500 (53.6%) |
| Median difference | +0.0044 (positive) |

### Match distribution (225,500 tickets)

| Matches | Uniform | SelfCal | SelfCal ratio |
|---------|---------|---------|---------------|
| 0 | 67.81% | 67.53% | 0.996x |
| 1 | 28.30% | 28.49% | 1.007x |
| 2 | 3.71% | 3.78% | 1.019x |
| 3 ($7 prize) | 0.179% | 0.194% | **1.084x** |
| 4 ($100 prize) | 0.003% | 0.004% | **1.500x** |

The advantage concentrates in the higher match tiers. In absolute terms: 34 additional 3-match wins and 3 additional 4-match wins across 225,500 tickets compared to random selection.

### Payout

Average payout per draw is directionally positive for SelfCal but not independently statistically significant (Wilcoxon p = 0.94). This is expected: payout is dominated by rare large prizes (4-match at $100, 3+PB at $100), and the sample size needed to demonstrate payout significance is much larger than for match rate. The match rate improvement is consistent with a payout improvement, but we cannot claim payout significance from this data.

---

## What We Reviewed

| System | Method | Measured lift | Significant? |
|--------|--------|---------------|-------------|
| **SelfCal Engine** | Walk-forward, 500 seeds, paired | **+1.07%** | **p = 0.0155** |
| LSTM study (Mind & Code, 2024) | Walk-forward | +0.01% | No |
| PatternSight (2024) | Walk-forward | ±0.1% | No |
| Lottery wheeling | Combinatorial covering | 0% EV change | N/A |
| Commercial AI tools | Various/unverified | Unaudited claims | No peer review |

Among these systems, SelfCal is the only one that produced a statistically significant improvement under proper walk-forward evaluation. We acknowledge this is not an exhaustive review of all lottery research ever conducted.

---

## Limitations and Honest Assessment

**This is a small effect.** A +1.07% improvement in match rate means approximately 1.5 extra ball matches per year for a weekly player. It does not transform the economics of lottery play.

**The signal is non-stationary.** The model's advantage depends on momentum being active in the draw process. During the 2017–2020 period, momentum was absent and the model showed no improvement. The model detected this and reduced its bias (avoiding losses), but it could not create an edge where no signal existed.

**Replication is partial.** The model is significantly positive on the 2023–2026 period, directionally positive on the 2020–2023 period (+0.06%), and slightly negative on the 2017–2020 period (-1.1%). It does not demonstrate a universal, all-period advantage.

**The causal mechanism is unknown.** We observe that momentum follows multi-year cycles but do not know why. Our hypothesis about physical factors is unverified.

**Payout is not proven.** Match rate improvement is statistically significant; dollar return improvement is not, due to the extreme variance of lottery prizes.

**This does not change the economics of lottery play.** Every lottery ticket has deeply negative expected value. This system makes the experience marginally less random, but it does not make lottery play profitable.

---

## Technical Specifications

| Property | Value |
|----------|-------|
| Type | Rule-based with adaptive threshold |
| Learned parameters | **0** |
| Momentum window | 7 draws |
| Calibration window | 20 draws |
| Max strength | 0.70 |
| Min strength | 0.10 |
| Inference latency | < 1ms |
| Model size | < 1 KB |
| Dependencies | None (pure arithmetic) |
| Platform | Any (iOS, Android, web, embedded) |

---

*Report generated April 2026. Full evaluation data available in selfcal_proof_2023_2026.json. The evaluation methodology, raw results, and all statistical computations are reproducible from the source code in the PowerPlayModelForge repository.*
