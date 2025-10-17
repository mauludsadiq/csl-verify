# CSL ↔ Categorical Proof Correspondence

## Objects and Functors
- Emission 𝓔 ↔ Raw files (bytes, FardBits lift)
- Zero-space 𝓩 ↔ ASC7 canonical forms
- Terminal 𝟙 ↔ Signed certificates
- T : 𝓔 → 𝓩 ↔ canonicalize(file) → canon
- Ψ : 𝓩 → 𝟙 ↔ sign(canon) → certificate
- Φ : 𝓔 → 𝓔 ↔ residual Ψ∘T − id (entropy delta)

## Axioms ↔ Implementation Invariants
- T² = T ↔ canonicalize(canonical) = canonical
- Ψ² = Ψ ↔ re-sign(canon) = same terminal id
- Φ² = 0 ↔ no infinite residual under recompute
- η : id_𝓔 ⇒ Ψ∘T ↔ CSL Verify from file to certificate

## Commuting Diagram
E --T--> Z --Ψ--> 1
|         ^
|         |
v         |
E --Φ-->  E

Equality: Φ = Ψ∘T − id_𝓔

## Testable Properties
- Entropy monotonicity: H(E) ≥ H(Z)
- Semantic equivalence: T(e₁)=T(e₂) ⇒ cert(e₁)=cert(e₂)
- Finitude: Collapse Code programs terminate
- Uniqueness: ∃! certificate for each T(e)

## Runtime Checks Bound To Axioms
- Hash equality of canonical outputs across platforms
- Signature idempotence on canonical payload
- Residual nilpotence via double-residual check
