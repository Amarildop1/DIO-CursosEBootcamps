package bancodigital;

public abstract class Conta implements IConta{

    private static final int AGENCIA_SEDE = 111;
    private static int SEQUENCIA_CONTA = 1;
    
    protected int agencia;
    protected int numero;
    protected double saldo;
    protected Cliente cliente;

    public Conta() {
        this.agencia = Conta.AGENCIA_SEDE;
        this.numero = Conta.SEQUENCIA_CONTA++;
    }

    //Métodos get()
    public int getAgencia() {
        return agencia;
    }

    public int getNumero() {
        return numero;
    }

    public double getSaldo() {
        return saldo;
    }

    public Cliente getCliente() {
        return cliente;
    }
    
    
    @Override
    public void sacar(double valor){
        this.saldo -= valor;
    }

    @Override
    public void depositar(double valor){
        this.saldo += valor;
    }    
    
    @Override
    public void transferir(double valor, Conta contaDestino){
        this.sacar(valor);
        contaDestino.depositar(valor);
    }
    
    public void imprimirDadosDaConta(){
        System.out.println(String.format("Agência: %d ", this.agencia));
        System.out.println(String.format("Número: %d ", this.numero));
        System.out.println(String.format("Saldo: %.2f ", this.saldo));
    }
}
