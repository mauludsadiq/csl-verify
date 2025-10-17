if __name__ == "__main__":
    print("\n" + "="*70)
    print("Initializing Mathematical Proof System…")
    print("="*70 + "\n")
    proof_system = MathematicalProofSystem()
    ok = proof_system.run_complete_proof()
    print("\n" + "="*70)
    if ok:
        print("✓ Proof execution completed successfully!")
        print("  All mathematical claims have been verified.")
    else:
        print("✗ Proof execution completed with errors.")
        print("  Some claims could not be verified.")
    print("="*70)
    sys.exit(0 if ok else 1)

__csl_last__ = 0
